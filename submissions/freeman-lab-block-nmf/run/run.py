def run(data, info):
    """
    Run a Thunder source extraction algorithm
    """
    from thunder import SourceExtraction
    from thunder.extraction import OverlapBlockMerger
    merger = OverlapBlockMerger(0.1)
    method = SourceExtraction('nmf', merger=merger, componentsPerBlock=5, percentile=95, minArea=100, maxArea=500)
    result = method.fit(data, size=(32, 32), padding=8)
    return result